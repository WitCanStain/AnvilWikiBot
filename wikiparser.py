from html.parser import HTMLParser
import json
import requests
response = requests.get('https://anvilempires.wiki.gg/api.php?action=query&format=json&prop=images|categoryinfo|pageprops&meta=&titles=Chainmail Armour&formatversion=2&cicontinue=')
# print (response.status_code)
# print (response.content)
parsed = json.loads(response.content)
data =json.loads(parsed["query"]["pages"][0]["pageprops"]["infoboxes"])
print(json.dumps(data, indent=4))
print("-----------------")

try: 
    from BeautifulSoup import BeautifulSoup
except ImportError:
    from bs4 import BeautifulSoup
html = data[0]["data"][5]["data"]["value"] #the HTML code you've written above
parsed_html = BeautifulSoup(html, features="lxml")
print("++++++++++++++++++")
print(parsed_html.prettify())
print(parsed_html.get_text())

def wiki_fetch(query):
    response = requests.get('https://anvilempires.wiki.gg/api.php?action=query&format=json&prop=images|categoryinfo|pageprops&meta=&titles=Chainmail Armour&formatversion=2&cicontinue=')
    parsed = json.loads(response.content)
    data =json.loads(parsed["query"]["pages"][0]["pageprops"]["infoboxes"])
    print(json.dumps(data, indent=4))

    try: 
        from BeautifulSoup import BeautifulSoup
    except ImportError:
        from bs4 import BeautifulSoup
    html = data[0]["data"][5]["data"]["value"] #the HTML code you've written above
    parsed_html = BeautifulSoup(html, features="lxml")
    print(parsed_html.prettify())
    print(parsed_html.get_text())


    # get category of item with categories query
    # convert to cargo table name
    # get cargo table fields with cargofields
    # filter any fields you don't want
    # get cargo content with cargoquery