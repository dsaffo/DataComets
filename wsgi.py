import sys

# add your project directory to the sys.path
project_home = u'.'
if project_home not in sys.path:
    sys.path = [project_home] + sys.path

from DataComets import app as application 