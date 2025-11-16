from django.db import models
from django.contrib.auth.models import User


class Predio(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    coordenadas = models.JSONField(null=True, blank=True)  
    
    class Meta:
        verbose_name_plural = "Prédios"
    
    def __str__(self):
        return self.nome

class Local(models.Model):
    TIPO_CHOICES = [
        ('sala de aula', 'Sala de aula'),
        ('banheiro', 'Banheiro'),
        ('restaurante', 'Restaurante'),
        ('biblioteca', 'Biblioteca'),
        ('administrativo', 'Administrativo'),
        ('laboratório', 'Laboratório'),
        ('outro', 'Outro'),
    ]
    
    nome = models.CharField(max_length=100)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    descricao = models.TextField()
    predio = models.ForeignKey(Predio, on_delete=models.CASCADE, related_name='locais')
    andar = models.CharField(max_length=50)
    localizacao_detalhada = models.TextField(null=True, blank=True)
    coordenadas = models.JSONField(null=True, blank=True)
    informacoes_extras = models.JSONField(null=True, blank=True)
    ativo = models.BooleanField(default=True)
    
    class Meta:
        verbose_name_plural = "Locais"
        ordering = ['predio', 'andar', 'nome']
    
    def __str__(self):
        return f"{self.nome} - {self.predio.nome}"
    


class FavoritoPredio(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='favoritos_predios'
    )
    predio = models.ForeignKey(
        Predio,
        on_delete=models.CASCADE,
        related_name='favoritado_por'
    )
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'predio')
        verbose_name = "Prédio Favorito"
        verbose_name_plural = "Prédios Favoritos"

    def __str__(self):
        return f"{self.user.username} favoritou o prédio {self.predio.nome}"


class FavoritoLocal(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='favoritos_locais'
    )
    local = models.ForeignKey(
        Local,
        on_delete=models.CASCADE,
        related_name='favoritado_por'
    )
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'local')
        verbose_name = "Local Favorito"
        verbose_name_plural = "Locais Favoritos"

    def __str__(self):
        return f"{self.user.username} favoritou o local {self.local.nome}"
