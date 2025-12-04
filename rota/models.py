from django.db import models
from django.conf import settings

class Predio(models.Model):
    nome = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.nome

class RegistroRota(models.Model):
    TIPO_CHOICES = [
        ("route", "Rota"),
        ("search", "Pesquisa"),
    ]
    # Usuário 
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="registros_rota",
    )
    #predio de destino
    predio = models.ForeignKey(
        Predio,
        on_delete=models.CASCADE,
        related_name="registros_rota",
    )
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, default="route")
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-criado_em"]

    def __str__(self):
        return f"{self.user} - {self.predio} ({self.tipo})"

