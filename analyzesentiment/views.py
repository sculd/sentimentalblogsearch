from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader, RequestContext

def index(request):
    return render(request, 'index.html', {})
    #return HttpResponse("Hello, world. You're at the sentiment index.")

# REST
from restless.views import Endpoint

class Hello(Endpoint):
    def get(self, request):
        name = request.params.get('name', 'World')
        return {'message': 'Hello, %s!' % name}
