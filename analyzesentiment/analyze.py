import indicoio
indicoio.config.api_key = '912e0cb4f75ec4449e341d535fefa6f4'
from bs4 import BeautifulSoup
import nltk   
import urllib.request
import requests
import logging
import re, string
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
    text = getContent(url)
    return emotion(text)

def _getContentBS(url):
    url = str(url)
    html_str = urllib.request.urlopen(url).read()
    soup = BeautifulSoup(html_str, 'html.parser')
    raw = soup.get_text()
    text = ' '.join(raw.split())
    return text

def getContent(url):
    print('[getContent] url:', url)
    s = requests.Session()
    r = s.get(url)

    # massage the string
    content = r.content.decode('utf8').replace('"', '')
    body = re.search(r'<body(.*)/body>', content, re.DOTALL).group(0)
    script_removed = re.sub(r'<(script).*?</\1>(?s)', '', body)
    a_removed = re.sub(r'<(a).*?</\1>(?s)', '', script_removed)
    img_removed = re.sub(r'<(img).*?/>(?s)', '', a_removed)
    no_newline_tab = img_removed.replace('\n','').replace('\t','')
    space_corrected = no_newline_tab.replace(u'\xa0', ' ')
    form_removed = re.sub(r'<(form).*?</\1>(?s)', '', space_corrected)
    tag_removed = re.compile(r'<.*?>').sub('', form_removed)
    tag_removed = ' '.join(tag_removed.split())
    
    logger.info('[getContent] content:')
    logger.info(no_newline_tab)
    return tag_removed

if __name__ == "__main__":
    url = 'https://www.yahoo.com'
    print(getContent(url))