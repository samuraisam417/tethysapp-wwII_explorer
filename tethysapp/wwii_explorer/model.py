from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, Float, Date, String, Text
from sqlalchemy.orm import sessionmaker

from .app import WwiiExplorer

engine = WwiiExplorer.get_persistent_store_engine('wwii_events_db')
SessionMaker = sessionmaker(bind=engine)
Base = declarative_base()

class Event(Base):
    '''
    Example SQLAlchemy DB Model
    '''
    __tablename__ = 'wwii_events'

    # Columns
    page_index = Column(Integer, primary_key=True)
    date_index = Column(Date)
    date = Column(String(50))
    title = Column(String(50))
    description = Column(Text)
    more_info = Column(Text)
    photo_url = Column(String(200))
    latitude= Column(Float)
    longitude = Column(Float)
    zoom_level= Column(Integer)
    kml_files = Column(String(100))


    def __init__(self, page_index, date_index, date, title, description, more_info, photo_url, latitude, longitude, zoom_level, kml_files):
        """
        Constructor for an event
        """
        self.page_index = page_index
        self.date_index = date_index
        self.date = date
        self.title = title
        self.description = description
        self.more_info = more_info
        self.photo_url =photo_url
        self.latitude = latitude
        self.longitude = longitude
        self.zoom_level = zoom_level
        self.kml_files = kml_files
