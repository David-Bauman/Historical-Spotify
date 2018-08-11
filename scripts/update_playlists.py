from requests import post, get
from datetime import datetime
from auth_options import payload, headers, url, connect_database
from description_fixer import description_fixer

cnx = connect_database()
cursor = cnx.cursor()
print_everything=False


def main(print_it=False):
    global cursor, cnx, print_everything
    print_everything = print_it
    response = post(url, data=payload, headers=headers, verify=True)
    if response.status_code != 200:
        raise Exception(response.reason)
    token = response.json()["access_token"]
    cursor.execute("SELECT apiEndpoint FROM hs_playlists.general")
    auth_header = {"Authorization": "Bearer " + token}

    endpoints = cursor.fetchall()
    for item in endpoints:
        endpoint = item[0]
        update_playlist(endpoint, auth_header)

    cnx.close()


def update_playlist(endpoint, auth):
    response = get("https://api.spotify.com/v1/users/" + endpoint, headers=auth)
    if response.status_code != 200:
        raise Exception(response.reason)
    now = datetime.today().strftime("%Y-%m-%d %H:%M:%S")

    info = response.json()
    tracks = info["tracks"]["items"]
    id = info["id"]
    song_ids = ""
    song_info = []
    for i in range(len(tracks)):
        track = tracks[i]
        song = track["track"]
        if i:
            song_ids += ","
        song_ids += song["id"]

        artists = ""
        for j in range(len(song["artists"])):
            if j:
                artists += ", "
            artists += song["artists"][j]["name"]
        song_info.append((song["id"], song["name"], artists, song["album"]["name"],
                          song["duration_ms"], song["album"]["release_date"]))

    description = description_fixer(info["description"])
    image = info["images"][0]["url"]
    playlist_info = (now, info["snapshot_id"], info["followers"]["total"], description, image, song_ids)
    global cursor, cnx, print_everything
    cursor.execute("SELECT songIds FROM hs_playlists." + id +
                   " WHERE timestamp=(SELECT MAX(timestamp) FROM hs_playlists." + id + ")")

    affected = [None]
    current = cursor.fetchall()
    if not len(current) or current[0][0] != song_ids:
        affected = []
        playlist_query = "INSERT INTO hs_playlists.%s VALUES %s;" % (id, playlist_info)
        cursor.execute(playlist_query)
        affected.append(cursor.rowcount)

        update_desc_image = "UPDATE hs_playlists.general SET description='%s', imageURL='%s' WHERE id='%s';" % \
                            (description, image, id)
        cursor.execute(update_desc_image)
        affected.append(cursor.rowcount)

        song_query = "INSERT IGNORE INTO hs_songs." + id + " VALUES (%s, %s, %s, %s, %s, %s);"
        cursor.executemany(song_query, song_info)
        affected.append(cursor.rowcount)

        cnx.commit()

    if __name__ == "__main__" or print_everything:
        print(affected)


if __name__ == "__main__":
    from time import time
    start_time = time()
    main()
    print("Updating playlists took %.2f seconds" % float(time() - start_time))
