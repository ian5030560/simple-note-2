from django.shortcuts import render


# Create your views here.
def aiReturn(request):
    # test website for backends
    return render(request, "index.html")  # return interface
