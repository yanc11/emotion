from django.conf.urls import patterns, include, url
#from mysite.views import current_datetime

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
	#(r'^time/$', current_datetime),
  url(r'^$', 'mysite.api.homepage'),
  url(r'^api/get_stress$', 'mysite.api.get_stress'),
  url(r'^api/get_stress_by_time$', 'mysite.api.get_stress_by_time'),
  url(r'^api/get_reason$', 'mysite.api.get_reason'),
  url(r'^api/get_keyword$', 'mysite.api.get_keyword'),
  url(r'^api/getweibo$', 'mysite.api.getweibo'),
  url(r'^api/predict$', 'mysite.api.predict'),
  url(r'^api/code$', 'mysite.api.code'),
    # Examples:
    # url(r'^$', 'mysite.views.home', name='home'),
    # url(r'^mysite/', include('mysite.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
