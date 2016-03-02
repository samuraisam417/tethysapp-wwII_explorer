from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .model import SessionMaker, Event
from django.http import JsonResponse


@login_required()
def home(request):
    """
    Controller for the app home page.
    """
    print "IN HOME CONTROLLER"

    session = SessionMaker()

    events = session.query(Event).order_by(Event.page_index).all()

    session.close()

    event_page_and_title = []

    for event in events:
        print event
        event_page_and_title.append({
            'page':  event.page_index,
            'title': event.title
        })

    context = {'events': event_page_and_title}

    return render(request, 'wwii_explorer/home.html', context)


def get_page_data(request):
    print "Running python script"

    page_index = request.GET['pageIndex']

    session = SessionMaker()

    event = session.query(Event).filter(Event.page_index==page_index).one()

    session.close()

    event_attributes = {
        'date_index': event.date_index,
        'date': event.date,
        'title': event.title,
        'description': event.description,
        'more_info': event.more_info,
        'photo_url': event.photo_url,
        'latitude': event.latitude,
        'longitude': event.longitude,
        'zoom_level': event.zoom_level,
        'kml_files': event.kml_files
    }

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

    return JsonResponse({
        'success': 'Extracted Event Data.',
        'event': event_attributes
    })
