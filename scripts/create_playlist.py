"""
Does no type/path checking. Do that in node/front end.
"""

from mysql.connector import connect
from requests import post, get
from datetime import datetime
from auth_options import payload, headers, url, connect_database
from description_fixer import description_fixer
from update_playlists import update_playlist

cnx = connect_dtabase()
cursor = cnx.cursor()


# paths is the list of strings like 'spotifycharts/playlists/37i9dQZF1DWTyiBJ6yEqeu'
def main(paths):
    global cursor, cnx
    response = post(url, data=payload, headers=headers, verify=True)
    if response.status_code != 200:
        raise Exception(response.reason)
    token = response.json()["access_token"]
    auth_header = {"Authorization": "Bearer " + token}
    for path in paths:
        create_playlist(path, auth_header)

    cnx.close()


def create_playlist(endpoint, auth):
    response = get("https://api.spotify.com/v1/users/" + endpoint, headers=auth)
    if response.status_code != 200:
        raise Exception(response.reason)
    global cursor, cnx
    info = response.json()
    playlist_id = info["id"]
    create_table_playlist = """
    CREATE TABLE IF NOT EXISTS hs_playlists.%s (timestamp DATETIME, snapshotId varchar(100), followers int,
    description varchar(250), imageURL varchar(200), songIds text, PRIMARY KEY (timestamp));
    """ % playlist_id
    cursor.execute(create_table_playlist)

    create_table_songs = """
    CREATE TABLE IF NOT EXISTS hs_songs.%s (songId char(22), name varchar(100), artists varchar(100),
    album varchar(100), duration int, releaseDate date, PRIMARY KEY (songId));
    """ % playlist_id
    cursor.execute(create_table_songs)
    image = info["images"][0]["url"]
    description = description_fixer(info["description"])
    insert_general = "INSERT IGNORE INTO hs_playlists.general (id, name, description, imageURL, apiEndpoint, views, " \
                     "createDate, user) VALUES %s;" % \
                     ((playlist_id, info["name"], description, image, endpoint, 0,
                       datetime.today().strftime("%Y-%m-%d"), info["owner"]["id"]),)

    cursor.execute(insert_general)
    cnx.commit()
    update_playlist(endpoint, auth)

    # for node
    print({"id": playlist_id, "name": info["name"], "imageURL": image, "description": description})


if __name__ == "__main__":
    from time import time
    from sys import argv

    if len(argv) > 1:
        endpoints = [argv[1]]
    else:
        # add to endpoints if running manually
        endpoints = []
    start_time = time()
    main(endpoints)
    if len(argv) == 1:
        print("Creating the playlists and updating them took %.2f seconds" % float(time() - start_time))
