from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .model import SessionMaker, Event
from django.http import JsonResponse


@login_required()
def home(request):
    """
    Controller for the app home page.
    """
    print "Contacting database for event details (home)"
    session = SessionMaker()
    events = session.query(Event).order_by(Event.page_index).all()
    session.close()

    event_page_and_title = []

    for event in events:
        event_page_and_title.append({
            'page':  event.page_index,
            'title': event.title
        })

    context = {'events': event_page_and_title}

    return render(request, 'wwii_explorer/home.html', context)


def get_page_data(request):
    print "Contacting databse for event details (page change)"

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

    """
    Controller for the app map page.
    """

    context = {}

    return JsonResponse({
        'success': 'Extracted Event Data.',
        'event': event_attributes
    })
