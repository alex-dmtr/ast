#include <iostream>
using namespace std;
int main()
{
    int a,b,dif;
    a=2+2;
    b=a+3;
    if (a>b)
    {
        dif=a-b;
    }
    else
    {
        if (b>a)
        {
            dif=b-a;
        }
        else
        {
            dif=0;
        }
    }
    cout<<dif<<endl;
    int aux,p,cif;
    aux=0;
    p=1;
    while (a>0)
    {
        cif=a%2;
        aux=aux+p*cif;
        p=p*10;
        a=a/2;
    }
    cout<<aux<<endl;
    return 0;
}