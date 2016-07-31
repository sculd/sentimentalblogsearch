from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader, RequestContext

from restless.views import Endpoint

def index(request):
    return render(request, 'index.html', {})
    #return HttpResponse("Hello, world. You're at the sentiment index.")

# REST
from analyzesentiment.analyze import emotion, emotionUrl, getContent

class Hello(Endpoint):
    def get(self, request):
        name = request.params.get('name', 'World')
        return {'message': 'Hello, %s!' % name}

class TextAnalyzer(Endpoint):
    def get(self, request):
        text = request.params.get('text', 'seattle rules')
        res = emotion(text)
        return res

class UrlAnalyzer(Endpoint):
    def get(self, request):
        text = request.params.get('url', 'http://www.yahoo.com')
        res = emotionUrl(text)
        return res

class UrlContent(Endpoint):
    def get(self, request):
        text = request.params.get('url', 'http://www.yahoo.com')
        res = getContent(text)
        return res
