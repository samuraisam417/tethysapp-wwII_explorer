from tethys_sdk.base import TethysAppBase, url_map_maker
from tethys_sdk.stores import PersistentStore


class WwiiExplorer(TethysAppBase):
    """
    Tethys app class for WWII Explorer.
    """

    name = 'WWII Explorer'
    index = 'wwii_explorer:home'
    icon = 'wwii_explorer/images/ww2flag.png'
    package = 'wwii_explorer'
    root_url = 'wwii-explorer'
    color = '#34495e'
    description = 'This app allows the user to navigate through key events of World War 2.'
    enable_feedback = False
    feedback_emails = []

    def url_maps(self):
        """
        Add controllers
        """
        url_map = url_map_maker(self.root_url)

        url_maps = (url_map(name='home',
                            url='wwii-explorer',
                            controller='wwii_explorer.controllers.home'),
                    url_map(name='getpagedata',
                            url='wwii-explorer/get-page-data',
                            controller='wwii_explorer.controllers.get_page_data')
                    )

        return url_maps

    def persistent_stores(self):
        """
        Add one or more persistent stores
        """
        stores = [PersistentStore(name='wwii_events_db',
                                  initializer='wwii_explorer.init_stores.init_wwii_events_db',
                                  spatial=False
                                  )
                  ]

        return stores
