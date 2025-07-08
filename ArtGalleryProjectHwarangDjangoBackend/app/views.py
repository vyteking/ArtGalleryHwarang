import time
from django.template import loader
from django.shortcuts import HttpResponse, render
import utils

# Create your views here.
def Appview(request):
    return HttpResponse()

def AppLayout(request):
    
    template = loader.get_template('index.html')
    context = {
        'timenow' : time.localtime,
        'vieworientation' : 3,
        'welcome':"Welcome!!",
        'headerpath':"./templates/interface/header/",
        'footerpath':"./templates/interface/footer/",
        }
    viewoption = {
        'verticalwriting' : True,
        }
    return HttpResponse(template.render(context, request))