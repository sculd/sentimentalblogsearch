from django.conf.urls import patterns, url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
	url(r'^hello/$', views.Hello.as_view()),
	url(r'^analyzetext/$', views.TextAnalyzer.as_view()),
	url(r'^analyzeurl/$', views.UrlAnalyzer.as_view()),
]

