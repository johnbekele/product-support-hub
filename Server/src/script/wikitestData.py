import os
import requests
import base64
from pymongo import MongoClient
from dotenv import load_dotenv
from time import sleep
import certifi  # ✅ add this

load_dotenv()

# Config
AZURE_PAT = os.getenv("AZURE_PAT")
MONGO_URI = os.getenv("MONGODB_URI")
AZURE_ORG = "tr-tax-default"
AZURE_PROJECT = "TAP UK Support"
WIKI_ID = "TAP-UK-Support.wiki"
START_PAGE = 900
MAX_EMPTY_COUNT = 20  # Stop after 20 consecutive pages with no content

# MongoDB with trusted certificate authority
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())  # ✅ fix SSL issue
db = client["Trdashboard"]
content_collection = db["Content"]

# Azure headers
auth_header = {
    "Authorization": f"Basic {base64.b64encode((':' + AZURE_PAT).encode()).decode()}"
}

# Wiki URL
def wiki_page_url(page_id):
    project_escaped = requests.utils.quote(AZURE_PROJECT)
    return f"https://dev.azure.com/{AZURE_ORG}/{project_escaped}/_apis/wiki/wikis/{WIKI_ID}/pages/{page_id}?includeContent=true&api-version=7.0"

# Start extracting
def extract_pages(start=START_PAGE):
    page_id = start
    empty_count = 0

    while empty_count < MAX_EMPTY_COUNT:
        try:
            url = wiki_page_url(page_id)
            response = requests.get(url, headers=auth_header)

            if response.status_code == 404:
                print(f"❌ Page {page_id} not found.")
                empty_count += 1
            elif response.ok:
                data = response.json()
                content = data.get("content", "").strip()

                if content:
                    document = {
                        "page_id": page_id,
                        "title": data.get("path", "").split("/")[-1],
                        "path": data.get("path"),
                        "content": content
                    }
                    content_collection.insert_one(document)
                    print(f"✅ Saved page {page_id}: {document['title']}")
                    empty_count = 0  # reset if valid
                else:
                    print(f"⚠️ Page {page_id} has no content.")
                    empty_count += 1
            else:
                print(f"❌ Error {response.status_code} on page {page_id}")
                empty_count += 1

        except Exception as e:
            print(f"🔥 Exception on page {page_id}: {e}")
            empty_count += 1

        page_id += 1
        sleep(0.2)  # prevent rate limiting

    print("🎉 Finished extracting.")

if __name__ == "__main__":
    extract_pages()
