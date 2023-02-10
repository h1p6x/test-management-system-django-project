from django import forms


class TestCaseForm(forms.Form):
   title = forms.CharField()
   steps = forms.CharField(widget=forms.Textarea)