from django.contrib import admin
from .models import Predio, Local

@admin.register(Predio)
class PredioAdmin(admin.ModelAdmin):
    list_display = ['nome', 'descricao']
    search_fields = ['nome']

@admin.register(Local)
class LocalAdmin(admin.ModelAdmin):
    list_display = ['nome', 'tipo', 'predio', 'andar', 'ativo']
    list_filter = ['tipo', 'predio', 'ativo']
    search_fields = ['nome', 'descricao']
    list_editable = ['ativo']