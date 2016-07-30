from django.conf.urls import patterns, url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
	url(r'^hello/$', views.Hello.as_view()),
]

