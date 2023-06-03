# # USING DYNAMIC
import pandas as pd
import numpy as np
from pymongo import MongoClient
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer

# MONGODB CONNECTION
client = MongoClient("mongodb+srv://abc123:mongodb@mycluster.ejia9i8.mongodb.net/soulsound-music")
db = client['soulsound-music']
users_collection = db['users']
music_collection = db['music']
users_df = pd.DataFrame(list(users_collection.find())).drop(columns="__v", axis=1)
music_df = pd.DataFrame(list(music_collection.find())).drop(columns=["_id", "__v"], axis=1)

music_df["primary_artists"] = music_df["primary_artists"].str.replace(" ", "")
music_df["primary_artists"] = music_df["primary_artists"].str.replace(",", " ")

### Content Based Recommendation on Artists

cv = CountVectorizer()
count_matrix = cv.fit_transform(music_df['primary_artists'])
tokens = cv.get_feature_names_out()
cosine_sim = cosine_similarity(count_matrix)

def recommend_artist(name,count):
  idx = music_df[music_df["track_name"] == name].index[0]
  similarity_score=list(enumerate(cosine_sim[idx]))
  similarity_score=sorted(similarity_score,key=lambda x:x[1],reverse=True)
  similarity_score=similarity_score[1:(count+1)]
  song_idxs=[i[0] for i in similarity_score]
  return music_df.iloc[song_idxs]

### Content Based Recommendation on Song Features

music_df[['energy','instrumentalness','key','liveness','loudness','speechiness','tempo','valence']] = music_df[['energy','instrumentalness','key','liveness','loudness','speechiness','tempo','valence']].fillna(value=0)

def recommend_soundSim(name,count):
    song = music_df[music_df['track_name'] == name]
    sim_song = music_df.copy()
    sound_prop = sim_song.loc[:,['energy','instrumentalness','key','liveness','loudness','speechiness','tempo','valence']]
    sim_song['Similar_to_song'] = cosine_similarity(sound_prop,sound_prop.to_numpy()[song.index[0],None]).squeeze()
    sim_song=sim_song.sort_values(by='Similar_to_song',ascending=False).drop(columns="Similar_to_song")
    return sim_song.iloc[1:count+1]

### Popularity Based Recommendation

def recommend_popularity(music_df, count):
  train_data_grouped = music_df.sort_values(['play_count'],ascending=False)
  return train_data_grouped.iloc[:count]

### Collaborative Based Recommendation

def recommend_collaborative(curr_user_id, count):
    users_collection = db['users']
    users_df = pd.DataFrame(list(users_collection.find())).drop(columns="__v", axis=1)
    # Step 1: Create user listening history
    user_listening_history = { 
        str(users_df.iloc[idx]["_id"]): users_df.iloc[idx]['listeningActivity'] for idx in range(len(users_df)) 
    }
    # Step 2: Compute user listening history vectors
    all_songs = list(set([song for songs in user_listening_history.values() for song in songs]))
    def compute_vector(listening_history, all_songs):
        vector = np.zeros(len(all_songs))
        for song in listening_history:
            vector[all_songs.index(song)] = 1
        return vector
    user_vectors = {}
    for user, listening_history in user_listening_history.items():
        user_vector = compute_vector(listening_history, all_songs)
        user_vectors[user] = user_vector
    # Step 3: Compute cosine similarity
    def compute_cosine_similarity(vector1, vector2):
        return cosine_similarity([vector1], [vector2])[0][0]
    # Step 4: Find similar users
    given_user = curr_user_id
    similar_users = {}
    for user, vector in user_vectors.items():
        if user != given_user:
            similarity = compute_cosine_similarity(user_vectors[given_user], vector)
            similar_users[user] = similarity
    # Sort the similar_users dictionary by cosine similarity values in descending order and return first n users
    similar_users = dict(list(sorted(similar_users.items(), key=lambda x: x[1], reverse=True))[0: 5])
    # Step 5: Generate recommendations based on the n similar users
    recommendations = []
    for user in similar_users.keys():
        for song in user_listening_history[user]:
            if song not in user_listening_history[given_user] and song not in recommendations:
                recommendations.append(song)    
    lst = []
    for track_id in recommendations[:count]:
        lst.append(music_df.loc[music_df['track_id'] == track_id])
    return pd.concat(lst)

def generate_recommendations(curr_user_id, song_name):
    if(song_name == None):
        recc_data = recommend_popularity(music_df, 10)
        return recc_data
    final_size = 10
    res1 = recommend_artist(song_name, 5)
    res1.reset_index(drop=True, inplace=True)
    res2 = recommend_soundSim(song_name, 15)
    res2.reset_index(drop=True, inplace=True)
    res3 = recommend_collaborative(curr_user_id, 15)
    res3.reset_index(drop=True, inplace=True)
    res4 = recommend_popularity(music_df, 10)
    res4.reset_index(drop=True, inplace=True)
    
    # Pseudo-random recommendation
    def recommend_pseudorandom():
        randomly_selected = pd.DataFrame()
        # randomly recommend a song from the top 10 of content-based (song features)
        randomly_selected = pd.concat([randomly_selected, res2[-5:].sample(1)])
        # randomly recommend a song from the top 10 of collaborative
        randomly_selected = pd.concat([randomly_selected, res3[-5:].sample(1)])
        # randomly recommend a song from the top 10 of popularity
        randomly_selected = pd.concat([randomly_selected, res4[-10:].sample(1)])

        return pd.DataFrame(randomly_selected)
    res5 = recommend_pseudorandom()
    recc_data = pd.concat([res1.iloc[:int(final_size * 0.3)], res2.iloc[:int(final_size * 0.4)], res3.iloc[:int(final_size * 0.2)], res4.iloc[:int(final_size * 0.1)], res5.iloc[:int(final_size * 0.1)]], ignore_index=True)
    return recc_data





# # # USING DYNAMIC
# import pandas as pd
# import numpy as np
# from pymongo import MongoClient
# from sklearn.metrics.pairwise import cosine_similarity
# from sklearn.feature_extraction.text import CountVectorizer
# import random

# # MONGODB CONNECTION
# client = MongoClient("mongodb+srv://abc123:mongodb@mycluster.ejia9i8.mongodb.net/soulsound-music")
# db = client['soulsound-music']
# try:
#     users_collection = db['users']
#     music_collection = db['music']
#     users_df = pd.DataFrame(list(users_collection.find())).drop(columns="__v", axis=1)
#     music_df = pd.DataFrame(list(music_collection.find())).drop(columns=["_id", "__v"], axis=1)
# except Exception as e:
#     print(f"Error fetching collections: {e}")

# music_df["primary_artists"] = music_df["primary_artists"].str.replace(" ", "")
# music_df["primary_artists"] = music_df["primary_artists"].str.replace(",", " ")

# ### Content Based Recommendation on Artists

# cv = CountVectorizer()
# count_matrix = cv.fit_transform(music_df['primary_artists'])
# tokens = cv.get_feature_names_out()
# cosine_sim = cosine_similarity(count_matrix)

# def recommend_artist(name,count):
#   idx = music_df[music_df["track_name"] == name].index[0]
#   similarity_score=list(enumerate(cosine_sim[idx]))
#   similarity_score=sorted(similarity_score,key=lambda x:x[1],reverse=True)
#   similarity_score=similarity_score[1:(count+1)]
#   song_idxs=[i[0] for i in similarity_score]
#   return music_df.iloc[song_idxs]

# ### Content Based Recommendation on Song Features

# music_df[['energy','instrumentalness','key','liveness','loudness','speechiness','tempo','valence']] = music_df[['energy','instrumentalness','key','liveness','loudness','speechiness','tempo','valence']].fillna(value=0)

# def recommend_soundSim(name,count):
#     song = music_df[music_df['track_name'] == name]
#     sim_song = music_df.copy()
#     sound_prop = sim_song.loc[:,['energy','instrumentalness','key','liveness','loudness','speechiness','tempo','valence']]
#     sim_song['Similar_to_song'] = cosine_similarity(sound_prop,sound_prop.to_numpy()[song.index[0],None]).squeeze()
#     sim_song=sim_song.sort_values(by='Similar_to_song',ascending=False).drop(columns="Similar_to_song")
#     return sim_song.iloc[1:count+1]

# ### Popularity Based Recommendation

# def recommend_popularity(music_df, count):
#   train_data_grouped = music_df.sort_values(['play_count'],ascending=False)
#   return train_data_grouped.iloc[:count]

# ### Collaborative Based Recommendation

# def recommend_collaborative(curr_user_id, count):
#     # Step 1: Create user listening history
#     user_listening_history = { 
#         str(users_df.iloc[idx]["_id"]): users_df.iloc[idx]['listeningActivity'] for idx in range(len(users_df))
#     }
#     # Step 2: Compute user listening history vectors
#     all_songs = list(set([song for songs in user_listening_history.values() for song in songs]))
#     def compute_vector(listening_history, all_songs):
#         vector = np.zeros(len(all_songs))
#         for song in listening_history:
#             vector[all_songs.index(song)] = 1
#         return vector
#     user_vectors = {}
#     for user, listening_history in user_listening_history.items():
#         user_vector = compute_vector(listening_history, all_songs)
#         user_vectors[user] = user_vector
#     # Step 3: Compute cosine similarity
#     def compute_cosine_similarity(vector1, vector2):
#         return cosine_similarity([vector1], [vector2])[0][0]
#     # Step 4: Find similar users
#     given_user = curr_user_id
#     similar_users = {}
#     for user, vector in user_vectors.items():
#         if user != given_user:
#             similarity = compute_cosine_similarity(user_vectors[given_user], vector)
#             similar_users[user] = similarity
#     # Sort the similar_users dictionary by cosine similarity values in descending order and return first n users
#     similar_users = dict(list(sorted(similar_users.items(), key=lambda x: x[1], reverse=True))[0: 5])
#     # Step 5: Generate recommendations based on the n similar users
#     recommendations = []
#     for user in similar_users.keys():
#         for song in user_listening_history[user]:
#             if song not in user_listening_history[given_user] and song not in recommendations:
#                 recommendations.append(song)    
#     lst = []
#     for track_id in recommendations[:count]:
#         lst.append(music_df.loc[music_df['track_id'] == track_id])
#     return pd.concat(lst)

# def generate_recommendations(curr_user_id, song_name):
#     final_size = 10
#     res2 = pd.DataFrame()
#     if(song_name == None):
#         recc_data = recommend_popularity(music_df, 10)
#         return recc_data
#     res1 = recommend_artist(song_name, 5)
#     res1.reset_index(drop=True, inplace=True)
#     res2 = recommend_soundSim(song_name, 15)
#     res2.reset_index(drop=True, inplace=True)
#     res3 = recommend_collaborative(curr_user_id, 15)
#     res3.reset_index(drop=True, inplace=True)
#     res4 = recommend_popularity(music_df, 10)
#     res4.reset_index(drop=True, inplace=True)
  
#     # Pseudo-random recommendation
#     def recommend_pseudorandom():
#         randomly_selected = []
#         # randomly recommend a song from the top 10 of content-based (song features)
#         randomly_selected.append(res2.iloc[random.randint(10, 14)])
#         # randomly recommend a song from the top 10 of collaborative
#         randomly_selected.append(res3.iloc[random.randint(10, 14)])
#         # randomly recommend a song from the top 10 of popularity
#         randomly_selected.append(res4.iloc[random.randint(1, 9)])
#         return pd.DataFrame(randomly_selected).sample(1)
#     res5 = recommend_pseudorandom()
#     recc_data = pd.concat([res1.iloc[:int(final_size * 0.3)], res2.iloc[:int(final_size * 0.4)], res3.iloc[:int(final_size * 0.2)], res4.iloc[:int(final_size * 0.1)], res5.iloc[:int(final_size * 0.1)]], ignore_index=True)
#     return recc_data






# import pandas as pd
# import numpy as np
# from sklearn.metrics.pairwise import cosine_similarity
# from sklearn.feature_extraction.text import CountVectorizer
# from pymongo import MongoClient
# import random
# # MONGODB CONNECTION
# client = MongoClient("mongodb+srv://abc123:mongodb@mycluster.ejia9i8.mongodb.net/soulsound-music")
# db = client['soulsound-music']
# collection = db['users']
# users_df = pd.DataFrame(list(collection.find()))

# df=pd.read_csv("mrs_data_v1_updated.csv")

# ### Content Based Recommendation on Artists

# df["primary_artists"] = df["primary_artists"].str.replace(" ", "")
# df["primary_artists"] = df["primary_artists"].str.replace(",", " ")

# cv = CountVectorizer()
# count_matrix = cv.fit_transform(df['primary_artists'])
# tokens = cv.get_feature_names_out()

# cosine_sim = cosine_similarity(count_matrix)

# def recommend_artist(name,count):
#   idx = df[df["track_name"] == name].index[0]
#   similarity_score=list(enumerate(cosine_sim[idx]))
#   similarity_score=sorted(similarity_score,key=lambda x:x[1],reverse=True)
#   similarity_score=similarity_score[1:(count+1)]
#   song_idxs=[i[0] for i in similarity_score]
#   return df.iloc[song_idxs]

# ### Content Based Recommendation on Song Features

# feature_cols = ['acousticness', 'danceability', 'energy',
#                 'instrumentalness', 'key', 'liveness', 'loudness', 'mode',
#                 'speechiness', 'tempo', 'valence']
# features_data = df[feature_cols]

# def recommend_soundSim(name,count):
#     song=df[df['track_name']==name]
#     sim_song=df.copy()
#     sound_prop=sim_song.loc[:,['energy','instrumentalness','key','liveness','loudness','speechiness','tempo','valence']]
#     sim_song['Similar_to_song']=cosine_similarity(sound_prop,sound_prop.to_numpy()[song.index[0],None]).squeeze()
#     sim_song=sim_song.sort_values(by='Similar_to_song',ascending=False).drop(columns="Similar_to_song")
#     return sim_song.iloc[1:count+1]

# ### Popularity Based Recommendation

# def recommend_popularity(df, count):
#   train_data_grouped = df.sort_values(['Play_count'],ascending=False)
#   return train_data_grouped.iloc[:count]

# ### Collaborative Based Recommendation

# def recommend_collaborative(curr_user_id, count):
#     # Step 1: Create user listening history
#     user_listening_history = { 
#         str(users_df.iloc[idx]["_id"]): users_df.iloc[idx]['listeningActivity'] for idx in range(len(users_df)) 
#     }
#     # Step 2: Compute user listening history vectors
#     all_songs = list(set([song for songs in user_listening_history.values() for song in songs]))
#     def compute_vector(listening_history, all_songs):
#         vector = np.zeros(len(all_songs))
#         for song in listening_history:
#             vector[all_songs.index(song)] = 1
#         return vector
#     user_vectors = {}
#     for user, listening_history in user_listening_history.items():
#         user_vector = compute_vector(listening_history, all_songs)
#         user_vectors[user] = user_vector
#     # Step 3: Compute cosine similarity
#     def compute_cosine_similarity(vector1, vector2):
#         return cosine_similarity([vector1], [vector2])[0][0]
#     # Step 4: Find similar users
#     given_user = curr_user_id
#     similar_users = {}
#     for user, vector in user_vectors.items():
#         if user != given_user:
#             similarity = compute_cosine_similarity(user_vectors[given_user], vector)
#             similar_users[user] = similarity
#     # Sort the similar_users dictionary by cosine similarity values in descending order and return first n users
#     similar_users = dict(list(sorted(similar_users.items(), key=lambda x: x[1], reverse=True))[0: 5])
#     # Step 5: Generate recommendations based on the n similar users
#     recommendations = []
#     for user in similar_users.keys():
#         for song in user_listening_history[user]:
#             if song not in user_listening_history[given_user] and song not in recommendations:
#                 recommendations.append(song)    
#     lst = []
#     for track_id in recommendations[:count]:
#         lst.append(df.loc[df['track_id'] == track_id])
#     return pd.concat(lst)

# # Old without psr
# # def generate_recommendations(curr_user_id, song_name):
# #     if(song_name == None):
# #         recc_data = recommend_popularity(df, 10)
# #     else:
# #         res1 = recommend_artist(song_name, 4)
# #         res2 = recommend_soundSim(song_name, 3)
# #         res3 = recommend_collaborative(curr_user_id, 2)
# #         res4 = recommend_popularity(df, 1)
# #         recc_data = pd.concat([res1, res2, res3, res4],ignore_index=True)
# #     return recc_data

# def generate_recommendations(curr_user_id, song_name):
#   final_size=10
#   res1 = recommend_artist(song_name, 5)
#   res1.reset_index(drop=True, inplace=True)
#   res2 = recommend_soundSim(song_name, 15)
#   res2.reset_index(drop=True, inplace=True)
#   res3 = recommend_collaborative(curr_user_id, 15)
#   res3.reset_index(drop=True, inplace=True)
#   res4 = recommend_popularity(df, 10)
#   res4.reset_index(drop=True, inplace=True)
  
#   # Pseudo-random recommendation
#   def recommend_pseudorandom():
#     randomly_selected = []
#     # randomly recommend a song from the top 10 of content-based (song features)
#     randomly_selected.append(res2.iloc[random.randint(10, 14)])
#     # randomly recommend a song from the top 10 of collaborative
#     randomly_selected.append(res3.iloc[random.randint(10, 14)])
#     # randomly recommend a song from the top 10 of popularity
#     randomly_selected.append(res4.iloc[random.randint(1, 9)])
#     return pd.DataFrame(randomly_selected).sample(1)
  
#   res5 = recommend_pseudorandom()
#   recc_data = pd.concat([res1.iloc[:int(final_size * 0.3)], res2.iloc[:int(final_size * 0.4)], res3.iloc[:int(final_size * 0.2)], res4.iloc[:int(final_size * 0.1)], res5.iloc[:int(final_size * 0.1)]], ignore_index=True)
#   return recc_data