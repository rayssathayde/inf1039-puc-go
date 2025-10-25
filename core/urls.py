from django.urls import path
from core import views

urlpatterns = [
    path('', views.home, name='home'),
    path('favorites/', views.favorites, name='favorites'),
    path('search_result/', views.search_result, name='search_results'),
    path('available_locations', views.available_locations, name='available_locations'),
    
]
