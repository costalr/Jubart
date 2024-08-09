from rest_framework.renderers import BrowsableAPIRenderer

class CustomBrowsableAPIRenderer(BrowsableAPIRenderer):
    def get_raw_data_form(self, data, view, method, request):
        """
        Override this method to ensure the raw data form is not rendered.
        """
        return None

    def get_context(self, data, accepted_media_type, renderer_context):
        """
        Remove the raw data from the context.
        """
        context = super().get_context(data, accepted_media_type, renderer_context)
        if 'raw_data_form' in context:
            context.pop('raw_data_form', None)
        return context
