from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# page_index = 0

@login_required()
def home(request):
    # global page_index
    # page_index = 0

    """
    Controller for the app home page.
    """
    context = {}

    return render(request, 'wwii_explorer/home.html', context)

def map(request):
    # global page_index

    """
    Controller for the app map page.
    """
    # check event index (if at 0, go to 1)
    #    if forward, do this; if back, do this
    # look at event database
    #   If Lat/Lon, then create point (point)
    #   If no Lat/Lon, use KML file (line, polygon)
    # create point for event
    # create info bubble for event
    # refresh map, send back to user
    context = {}

    return render(request, 'wwii_explorer/map.html', context)