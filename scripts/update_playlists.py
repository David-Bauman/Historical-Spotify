#! /usr/bin/python3

from requests import post, get
from datetime import datetime
from auth_options import payload, headers, url, connect_database
from description_fixer import description_fixer
from time import sleep
from random import choice
from time import time

cnx = connect_database()
cursor = cnx.cursor()


def main():
    with open("last_updated.txt") as f:
        last_updated = datetime.strptime(f.readline(), "%Y-%m-%d %H:%M:%S")
    now = datetime.today()
    diff = now - last_updated
    if diff.seconds < 21600:
        update = choice(range(10))
        if update != 4:
            print("Not updating - %d, %d" % (update, diff.seconds))
            return False
    print("Updating")
    response = post(url, data=payload, headers=headers, verify=True)
    if response.status_code != 200:
        raise Exception(response.reason)
    token = response.json()["access_token"]
    auth_header = {"Authorization": "Bearer " + token}
    cursor.execute("SELECT apiEndpoint FROM hs_playlists.general")
    endpoints = cursor.fetchall()
    rand = range(1, int(1800/len(endpoints)))
    for item in endpoints:
        endpoint = item[0]
        sleep(choice(rand))
        update_playlist(endpoint, auth_header)

    cnx.close()
    with open("last_updated.txt", "w") as f:
        f.write(now.strftime("%Y-%m-%d %H:%M:%S"))
    return True


def update_playlist(endpoint, auth):
    response = get("https://api.spotify.com/v1/users/" + endpoint, headers=auth)
    if response.status_code != 200:
        print(response.reason)
        return
    now = datetime.today().strftime("%Y-%m-%d %H:%M:%S")

    info = response.json()
    tracks = info["tracks"]["items"]
    playlist_id = info["id"]
    song_ids = ""
    song_info = []
    for i in range(len(tracks)):
        track = tracks[i]
        song = track["track"]
        if song == None:  # Seems like Spotify is just sending some empty tracks sometimes?
            print("Possible error, likely on Spotify's side")
            print(track, endpoint, i, len(tracks), "\n")
            continue
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
    try:
        image = info["images"][0]["url"]
    except IndexError:
        print("Errored out in {} trying to get the playlist image. Here's the response object [\"images\"]: {}".format(description, info["images"]))
        return
    playlist_info = (now, info["snapshot_id"], info["followers"]["total"], description, image, song_ids)
    global cursor, cnx
    cursor.execute("SELECT songIds, description, imageURL FROM hs_playlists." + playlist_id +
                   " WHERE timestamp=(SELECT MAX(timestamp) FROM hs_playlists." + playlist_id + ")")

    affected = [None]
    current = cursor.fetchall()
    if not len(current) or current[0][0] != song_ids or current[0][1] != description or current[0][2] != image:
        affected = []
        playlist_query = "INSERT INTO hs_playlists.%s VALUES %s;" % (playlist_id, playlist_info)
        cursor.execute(playlist_query)
        affected.append(cursor.rowcount)

        update_desc_image = "UPDATE hs_playlists.general SET description='%s', imageURL='%s' WHERE id='%s';" % \
                            (description, image, playlist_id)
        cursor.execute(update_desc_image)
        affected.append(cursor.rowcount)

        song_query = "INSERT IGNORE INTO hs_songs." + playlist_id + " VALUES (%s, %s, %s, %s, %s, %s);"
        cursor.executemany(song_query, song_info)
        affected.append(cursor.rowcount)

        cnx.commit()

    print(affected)


if __name__ == "__main__":
    print(datetime.today().strftime("%Y-%m-%d %H:%M:%S"))
    start_time = time()
    if main():
        print("Updating playlists took %.2f seconds\n" % float(time() - start_time))
    else:
        print("\n")
else:
    print("Where is this being called from?")
