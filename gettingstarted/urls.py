from django.conf.urls import include, url

from django.contrib import admin
admin.autodiscover()

import analyzesentiment.views

# Examples:
# url(r'^$', 'gettingstarted.views.home', name='home'),
# url(r'^blog/', include('blog.urls')),

urlpatterns = [
    url(r'^$', analyzesentiment.views.index, name='index'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^analyzesentiment/', include('analyzesentiment.urls')),
]
