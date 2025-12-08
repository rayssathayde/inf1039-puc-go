from django.urls import path
from core import views

urlpatterns = [
    path('', views.home, name='home'),
    path('sobre/', views.sobre, name='sobre'),
    path('search_result/', views.search_result, name='search_results'),
    path('available_locations/', views.available_locations, name='available_locations'),
    path('info_ambientes/local/<int:local_id>/', views.info_ambientes, name='info_ambientes'),
]
