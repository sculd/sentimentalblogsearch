import indicoio
indicoio.config.api_key = '912e0cb4f75ec4449e341d535fefa6f4'
from bs4 import BeautifulSoup
import nltk   
import urllib.request
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

if __name__ == "__main__":
    # single example
    res = indicoio.sentiment("I love writing code!")
    print(res)

    # batch example
    res = indicoio.sentiment([
        "I love writing code!",
        "Alexander and the Terrible, Horrible, No Good, Very Bad Day"
    ])
    print(res)

    # single example
    res = indicoio.emotion("I did it. I got into Grad School. Not just any program, but a GREAT program. :-)")
    print(res)

    # batch example
    res = indicoio.emotion([
        "I did it. I got into Grad School. Not just any program, but a GREAT program. :-)",
        "Like seriously my life is bleak, I have been unemployed for almost a year."
    ])
    print(res)
