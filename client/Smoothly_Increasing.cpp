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
#define gcd(x,y) __gcd(x,y) 
#define lcm(x,y) (x*y)/__gcd(x,y) 
#define srtr(v) sort(v.begin(),v.end(), greater<long long>());
#define ub(x,v) upper_bound(v.begin(),v.end(),x);
#define lb(x,v) lower_bound(v.begin(),v.end(),x);
#define pi pair<ll, ll>
#define rev(v) reverse(v.begin(), v.end());
#define vi vector<ll>
void solve(){
    var(n)
    ll a[n];
    for(ll i = 0;i<n;i++){
        cin >> a[i];
    }
    string ans = "";
    for(ll i = 0;i<n;i++){
        if(i>100) {
            ans.pb('0');
            continue;
        } 
        vector<ll>v;
        for(ll j = 0;j<n;j++){
            if(i == j ) continue;
            v.pb(a[j]);
        }

        bool flag = true;
        for(ll i  = 1;i<v.size();i++){
            if(v[i] > v[i-1] && (i == 1? true: v[i] - v[i-1] > v[i-1] - v[i-2]))  continue;
            flag = false;
            break;
        }

        if(flag) ans.pb('1');
        else ans.pb('0');
    }
    print(ans)
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