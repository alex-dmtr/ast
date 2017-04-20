#include <iostream>
using namespace std;
int main()
{
    int a,b,n,i;
    cin>>a>>b;
    if (a>b)
    {
        cout<<a<<endl;
    }
    else
    {
        if (b>a)
        {
            cout<<b<<endl;
        }
        else
        {
            cout<<0<<endl;
        }
    }
    i=1;
    while (i<n+1)
    {
        cout<<i<<endl;
    }
    return 0;
}