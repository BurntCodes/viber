import json

class SeedEngine:
    def __init__(self, prev_seeds):
        if type(prev_seeds) == str:
            print("converting prev_seeds to json")
            self.prev_seeds = json.loads(prev_seeds)
        else:
            self.prev_seeds = prev_seeds
        print("prev_seeds:")
        print(self.prev_seeds)
        print(type(self.prev_seeds))

    def gen_new_seeds(self):
        seed_artists = ""
        print("\n checking seeds\n")
        print(self.prev_seeds)
        for artist in self.prev_seeds:
            seed_artists += f"{artist["id"]},"

        seed_artists = seed_artists[:-1]
        return seed_artists
