from rest_framework.views import APIView
from rest_framework.response import Response
from utils import get_collection

class PostListView(APIView):
    def get(self, request):
        post_collection = get_collection('post_post')
        posts = []
        for post in post_collection.find():
            posts.append({
                'postindex': str(post.get('postindex')),
                'posttitle': post.get('posttitle'),
                'postauthor': str(post.get('postauthor_id')), # Assuming you store author's id
                'postdescription': post.get('postdescription'),
                'posttag': post.get('posttag'),
            })
        return Response(posts)
