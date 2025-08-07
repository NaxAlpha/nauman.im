import os
import httpx
import rich
import json


def search_maps(query: str, location: str, start: int = 0):
    response = httpx.get(
        url="https://serpapi.com/search",
        params=dict(
            engine="google_maps",
            q=query,
            api_key=os.getenv("SERPAPI_KEY"),
            ll=location,
            start=start,
        ),
    )
    rich.print(response.request.url)
    return response.json()


def main():
    print("Hello from japan-halal!")
    results = search_maps(
        "halal restaurants Tokyo",
        "@35.5092404,139.7698121,8z",  # Tokyo metropolitan area
    )
    with open("out.json", "w") as f:
        json.dump(results, f, indent=4)


if __name__ == "__main__":
    main()
