
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
ll cal(ll i,ll state, vector<vi>&ind, ll a[], vector<vi>&dp, ll n){
    if(i>=n){
        return 0;
    }
    if(dp[i][state]!=-1) return dp[i][state];
    ll ans = 1 + cal(i+1,1, ind, a, dp, n);
    auto it = upper_bound(ind[a[i]].begin(), ind[a[i]].end(), i);
    if(it!=ind[a[i]].end()){
        ans = min(ans, cal((*it), 0,ind, a, dp, n));
    }
    it = upper_bound(ind[0].begin(), ind[0].end(), i);
    if(it!=ind[0].end()){
        ans = min(ans, cal((*it),0, ind, a, dp, n));
    }
    if(state == 1 && a[i] ==0) ans = min(ans, 1LL);
    return dp[i][state] = ans;
}
void solve(){
    var(n)
    ll a[n];
    vector<vi>ind(n+1);
    for(ll i = 0;i<n;i++){
        cin >> a[i];
        ind[a[i]].pb(i);
    }
    for(ll i = 0;i<=n;i++) srt(ind[i]);
    vector<vi>dp(n, vi(2,-1));
    print(cal(0,1, ind, a,dp, n))
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