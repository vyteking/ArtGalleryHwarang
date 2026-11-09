import uuid

from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed

# The browser sends this header to say which logged-in account a request is for.
#
# It also protects against CSRF. Cookies are attached automatically, but a page on another
# origin cannot add a custom header without passing the CORS preflight check, so requests
# without the header are never authenticated from the cookie.
ACCOUNT_HEADER = 'X-Hwarang-Account'


def auth_cookie_name(account):
    return f'hwarang_token_{account}'


def parse_account_header(request):
    """Return the account named by the request header as a canonical string, or None."""
    try:
        return str(uuid.UUID(request.headers.get(ACCOUNT_HEADER, '')))
    except ValueError:
        return None


class AccountCookieAuthentication(TokenAuthentication):
    """
    Token authentication that reads the token from the selected account's HttpOnly cookie.

    A missing or revoked token is treated as anonymous rather than as an error, so public
    pages still load. Views that need a login then answer 401 and the frontend drops the account.
    """

    def authenticate(self, request):
        account = parse_account_header(request)
        if account is None:
            return None

        key = request.COOKIES.get(auth_cookie_name(account))
        if not key:
            return None

        try:
            user, token = self.authenticate_credentials(key)
        except AuthenticationFailed:
            return None

        return (user, token) if str(user.pk) == account else None
