from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader, RequestContext

from restless.views import Endpoint

def index(request):
    return render(request, 'index.html', {})
    #return HttpResponse("Hello, world. You're at the sentiment index.")

# REST
