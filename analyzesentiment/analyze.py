import indicoio
indicoio.config.api_key = '912e0cb4f75ec4449e341d535fefa6f4'
from bs4 import BeautifulSoup
import nltk   
import urllib.request
import requests
import logging
logging.basicConfig(filename='analyze.log',level=logging.INFO)
logger = logging.getLogger(__name__)
#indicoio.config.api_key = '912e0cb4f75ec4449e341d535fefa6f4'

def emotion(text):
    text = text.encode('ascii','ignore')
    print('[emotion] analyzing text...')
    logger.info('[emotion] analyzing text:')
    logger.info(text)
    res = indicoio.emotion(text)
    logger.info(res)
    return res

def emotionUrl(url):
    url = str(url)
    print('[emotionUrl] url:', url)
    logger.info('[emotionUrl] url: ' + url)
    html_str = urllib.request.urlopen(url).read()
    soup = BeautifulSoup(html_str, 'html.parser')
    raw = soup.get_text()
    text = ' '.join(raw.split())
    return emotion(text)

def getContent(url):
    print('[getContent] url:', url)
    s = requests.Session()
    r = s.get(url)
    content = r.content.decode('utf8').replace('"', '')
    logger.info('[getContent] content:')
    logger.info(content)
    return content

if __name__ == "__main__":
    url = 'https://www.yahoo.com'
    print(getContent(url))