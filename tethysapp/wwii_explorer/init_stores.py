from .model import engine, SessionMaker, Base, Event

import gspread
from oauth2client.service_account import ServiceAccountCredentials


def init_wwii_events_db(first_time):
    Base.metadata.create_all(engine)

    if first_time:

        print "CREATING DATABASE"

        # Make session
        session = SessionMaker()

        scope = ['https://spreadsheets.google.com/feeds']
        credentials = ServiceAccountCredentials.from_json_keyfile_name('/home/shawn/Documents/credentials.json', scope)
        gc = gspread.authorize(credentials)

        sheet = gc.open_by_key('1EQqDDAMS5bisSPYT0x8k6QpjRfl5SWxBQI9Qjg8ciGQ')
        worksheet = sheet.get_worksheet(0)
        # values_list = worksheet.row_values(1)
        lists_of_event_data = worksheet.get_all_values()

        ignore_list = True
        for data_list in lists_of_event_data:
            if ignore_list:
                ignore_list = False
                continue
            print "ADDING EVENT"
            session.add(Event(*data_list))

        session.commit()
