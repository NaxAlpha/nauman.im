import os
import rich
import json
import httpx
from ulid import ULID
from pathlib import Path

# TODO: Add more cities
cities = {
    "tokyo": "@35.5092404,139.7698121,8z",
}
run_id = str(ULID())
rich.print(f"Run ID: {run_id}")

data_path = Path(f"./data/{run_id}")

place_ids = dict()
user_ids = dict()

rich.print("Running the search...")
for city, location in cities.items():
    rich.print(f"\tSearching Halal Restaurants in `{city}`...")

    search_path = data_path / "searches" / city
    search_path.mkdir(parents=True, exist_ok=True)

    for idx in range(3):  # Max 60 results
        search_file = search_path / f"{idx}.json"
        start = idx * 20
        rich.print(f"\t\tSearching results `{start}`...")
        response = httpx.get(
            url="https://serpapi.com/search",
            params=dict(
                engine="google_maps",
                q=f"halal restaurants {city}",
                api_key=os.getenv("SERPAPI_KEY"),
                ll=location,
                start=start,
            ),
        )
        results = response.json()
        for result in results["local_results"]:
            place_ids[result["place_id"]] = result["title"]
        with open(search_file, "w") as f:
            json.dump(results, f, indent=4)

rich.print(f"Fetching reviews for {len(place_ids)} places...")
for place_id, place_name in place_ids.items():
    rich.print(f"\tFetching reviews for `{place_name}`...")

    reviews_path = data_path / "reviews" / place_id
    reviews_path.mkdir(parents=True, exist_ok=True)

    idx = 0
    next_page_token = None
    while True:
        rich.print(f"\t\tFetching reviews `{idx}`...")
        params = dict(
            engine="google_maps_reviews",
            api_key=os.getenv("SERPAPI_KEY"),
            place_id=place_id,
            sort_by="newestFirst",
        )
        if idx != 0:
            params.update(
                next_page_token=next_page_token,
                num=20,
            )
        response = httpx.get(
            url="https://serpapi.com/search",
            params=params,
        )
        reviews = response.json()
        for review in reviews["reviews"]:
            user = review["user"]
            user_ids[user["contributor_id"]] = user["name"]
        with open(reviews_path / f"{idx}.json", "w") as f:
            json.dump(reviews, f, indent=4)
        idx += 1
        if "serpapi_pagination" not in reviews or idx >= 2:  # Max 40 recent reviews
            break
        next_page_token = reviews["serpapi_pagination"]["next_page_token"]


rich.print(f"Fetching user reviews for {len(user_ids)} users...")
for user_id, user_name in user_ids.items():
    rich.print(f"\tFetching user reviews for `{user_name}`...")

    user_path = data_path / "users" / user_id
    user_path.mkdir(parents=True, exist_ok=True)

    idx = 0
    next_page_token = None
    while True:
        rich.print(f"\t\tFetching user reviews `{idx}`...")
        params = dict(
            engine="google_maps_contributor_reviews",
            api_key=os.getenv("SERPAPI_KEY"),
            contributor_id=user_id,
            num=200,
        )
        if idx != 0:
            params.update(
                next_page_token=next_page_token,
                num=200,
            )
        response = httpx.get(
            url="https://serpapi.com/search",
            params=params,
        )
        reviews = response.json()
        with open(user_path / f"{idx}.json", "w") as f:
            json.dump(reviews, f, indent=4)
        idx += 1
        if "serpapi_pagination" not in reviews or idx >= 1:  # Max 200 reviews
            break
        next_page_token = reviews["serpapi_pagination"]["next_page_token"]


rich.print("Done!")
