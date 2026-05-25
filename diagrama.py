# archivo: diagrama_investigador.py
from graphviz import Digraph

# Crear el diagrama
diagrama = Digraph('CasoDeUsoInvestigador', filename='caso_uso_investigador', format='png')
diagrama.attr(rankdir='LR', size='8,5')

# Actor
diagrama.node('Investigador', ' Investigador', shape='ellipse', style='filled', color='lightblue')

# Sistema
diagrama.node('Sistema', 'Sistema CRUD de Imágenes y Categorías', shape='rectangle', style='filled', color='lightgrey')

# Casos de uso principales
casos_principales = ['Gestionar Categorías', 'Gestionar Imágenes', 'Consultar Métricas']
for caso in casos_principales:
    diagrama.node(caso, caso, shape='ellipse', color='deepskyblue')

# Subcasos de Categorías
categorias = ['Crear Categoría', 'Listar Categorías', 'Editar Categoría', 'Eliminar Categoría']
for c in categorias:
    diagrama.node(c, c, shape='ellipse', color='lightcyan')
    diagrama.edge('Gestionar Categorías', c)

# Subcasos de Imágenes
imagenes = ['Subir Imagen', 'Listar Imágenes', 'Editar Imagen', 'Eliminar Imagen']
for i in imagenes:
    diagrama.node(i, i, shape='ellipse', color='lightcyan')
    diagrama.edge('Gestionar Imágenes', i)

# Subcasos de Métricas
metricas = ['Conteo por Categoría', 'Ver Estadísticas']
for m in metricas:
    diagrama.node(m, m, shape='ellipse', color='lightcyan')
    diagrama.edge('Consultar Métricas', m)

# Conexiones actor-sistema
diagrama.edge('Investigador', 'Sistema')
diagrama.edge('Sistema', 'Gestionar Categorías')
diagrama.edge('Sistema', 'Gestionar Imágenes')
diagrama.edge('Sistema', 'Consultar Métricas')

# Renderizar imagen
diagrama.render(view=True)
