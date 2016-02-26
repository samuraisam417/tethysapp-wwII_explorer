from tethys_sdk.base import TethysAppBase, url_map_maker


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
    description = 'Place a brief description of your app here.'
    enable_feedback = False
    feedback_emails = []

        
    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (UrlMap(name='home',
                           url='wwii-explorer',
                           controller='wwii_explorer.controllers.home'),
                    UrlMap(name='map',
                           url='wwii-explorer/map',
                           controller='wwii_explorer.controllers.map'),
        )

        return url_maps

    def persistent_stores(self):
        """
        Add one or more persistent stores
        """
        stores = (PersistentStore(name='wwii_events_db',
                                  initializer='init_stores:init_wwii_events_db',
                                  spatial=False
                )
        )

        return stores