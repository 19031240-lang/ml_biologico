from graphviz import Digraph

# Crear el diagrama para el Alumno
diagrama_alumno = Digraph('CasoDeUsoAlumno', filename='caso_uso_alumno', format='png')
diagrama_alumno.attr(rankdir='LR', size='8,5')

# Actor
diagrama_alumno.node('Alumno', 'Alumno', shape='ellipse', style='filled', color='lightgreen')

# Sistema
diagrama_alumno.node('Sistema', 'Sistema de Gestión de Aprendizajes', shape='rectangle', style='filled', color='lightgrey')

# Casos de uso principales para el Alumno
casos_principales_alumno = ['Gestionar Perfil', 'Acceder a Contenido', 'Visualizar Logros (Logos)', 'Consultar Progreso (Aprendizajes)']
for caso in casos_principales_alumno:
    diagrama_alumno.node(caso, caso, shape='ellipse', color='deepskyblue')

# Subcasos de Gestionar Perfil
perfil_subcasos = ['Ver Perfil', 'Editar Información Personal', 'Cambiar Contraseña']
for p_caso in perfil_subcasos:
    diagrama_alumno.node(p_caso, p_caso, shape='ellipse', color='lightcyan')
    diagrama_alumno.edge('Gestionar Perfil', p_caso)

# Subcasos de Acceder a Contenido
contenido_subcasos = ['Explorar Cursos', 'Inscribirse en Curso', 'Acceder a Lecciones', 'Realizar Actividad/Examen']
for c_caso in contenido_subcasos:
    diagrama_alumno.node(c_caso, c_caso, shape='ellipse', color='lightcyan')
    diagrama_alumno.edge('Acceder a Contenido', c_caso)

# Subcasos de Visualizar Logros (Logos)
logros_subcasos = ['Ver Insignias Obtenidas', 'Descargar Certificados', 'Compartir Logros']
for l_caso in logros_subcasos:
    diagrama_alumno.node(l_caso, l_caso, shape='ellipse', color='lightcyan')
    diagrama_alumno.edge('Visualizar Logros (Logos)', l_caso)

# Subcasos de Consultar Progreso (Aprendizajes)
progreso_subcasos = ['Ver Resumen de Progreso', 'Consultar Calificaciones', 'Revisar Retroalimentación']
for pr_caso in progreso_subcasos:
    diagrama_alumno.node(pr_caso, pr_caso, shape='ellipse', color='lightcyan')
    diagrama_alumno.edge('Consultar Progreso (Aprendizajes)', pr_caso)

# Conexiones actor-sistema para el Alumno
diagrama_alumno.edge('Alumno', 'Sistema')
diagrama_alumno.edge('Sistema', 'Gestionar Perfil')
diagrama_alumno.edge('Sistema', 'Acceder a Contenido')
diagrama_alumno.edge('Sistema', 'Visualizar Logros (Logos)')
diagrama_alumno.edge('Sistema', 'Consultar Progreso (Aprendizajes)')

# Renderizar imagen
diagrama_alumno.render(view=True)