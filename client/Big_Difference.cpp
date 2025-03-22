
#include<bits/stdc++.h>
#include<ext/pb_ds/assoc_container.hpp>
#include<ext/pb_ds/tree_policy.hpp>
 
using namespace std;
using namespace __gnu_pbds;
 
typedef tree<int, null_type, less<int>, rb_tree_tag, tree_order_statistics_node_update> pbds; // find_by_order, order_of_key
 
#define ll long long
#define println(x) cout<<x<<endl;
#define print(x) {cout<<x<<endl; return;}
#define printv(x) {for(auto e : x) cout<<e <<" "; cout<<endl;}
#define var(x) ll x; cin>>x;
#define oyes {cout<<"YES"<<endl; return;}
#define ono {cout<<"NO"<<endl; return;}
#define pb push_back
#define srt(v) sort(v.begin(),v.end());
// #define gcd(x,y) __gcd(x,y) 
// #define lcm(x,y) (x*y)/gcd(x,y) 
#define srtr(v) sort(v.begin(),v.end(), greater<long long>());
#define ub(x,v) upper_bound(v.begin(),v.end(),x);
#define lb(x,v) lower_bound(v.begin(),v.end(),x);
#define pi pair<ll, ll>
#define rev(v) reverse(v.begin(), v.end());
#define vi vector<ll>
void solve(){
    var(n)
    var(k)
    ll m = n;
    if(n%2==0) m--;

    ll gd = __gcd(m, 2LL);
    ll lm = (m*2)/(gd);

    if(abs(m-2)>=k && abs(gd-lm)>=2*k) {
        cout << m << " "<< 2 << endl;
    }
    else cout << - 1 <<" " << -1 << endl;
}
signed main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);
    var(t)
    while(t--){
        solve();
    }
}