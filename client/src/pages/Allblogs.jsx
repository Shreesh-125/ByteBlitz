import { useQuery } from "@tanstack/react-query";
import goldentrophy from "../assets/goldentrophy.png";
import profile_icon from "../assets/profile_icon.png";
import stylesall from "../styles/Allblogs.module.css";
import Blog from "../ui/Blog";
import { getAllBlogs } from "../servers/getAllBlogs";
import { useState } from "react";
import Loader from "../ui/Loader";
const Allblogs = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  let blogData = [
    {
      iconpath: goldentrophy,
      time: "a day ago",
      title: "Join our Weekly Contest 457",
      text: "We are happy to announce this contest and hope you participate in it.",
      whoposted: "Manu_codeup",
    },
    {
      iconpath: profile_icon,
      time: "8 days ago",
      title: "An anonymous user posted",
      text: "Nihao! Hello to all fans of competitive programming and Codeforces enjoyers On behalf of Tsinghua University’s Zhili College, we — your proud and slightly sleep-deprived Class of 2028 Information and Computing Science students — are happy to invite you to participate in Codeforces Round 1010 (Div. 1, Unrated) and Codeforces Round 1010 (Div. 2, Unrated), which will take place on Saturday, March 15, 2025 at 20:05UTC+5.5. Note the unusual start time of the round. You’ll have 3 hours to tackle 7 problems for division 1 and 6 problems for division 2, the round will be rated for all participants. It’s a little longer than your typical Codeforces round, and yes, we know you’ll be sleep-deprived — but who needs sleep when there’s coding to do, right? This round’s problems are brought to you by the incredible Ecrade_, newbiewzs, chen_03, 18Michael and sunzh. Special thank you to dapingguo8, Zesty_Fox and Iam1789 who also prepared problems that were ultimately not used in this round. A massive THANK YOU to the following legends who made this event possible: The one and only KAN for his invaluable support in hosting the round.Our chad coordinator, FairyWinx for coordinating this round, finding testers, and providing moral and technical support ckle 7 problems for division 1 and 6 problems for division 2, the round will be rated for all participants. It’s a little longer than your typical Codeforces round, and yes, we know you’ll be sleep-deprived — but who needs sleep when there’s coding to do, right? This round’s problems are brought to you by the incredible Ecrade_, newbiewzs, chen_03, 18Michael and sunzh. Special thank you to dapingguo8, Zesty_Fox and Iam1789 who also prepared problems ",
      whoposted: "Manu_codeup",
    },
    {
      iconpath: profile_icon,
      time: "8 days ago",
      title: "Meta Onsite Interview Experience",
      text: "Just finished Meta onsite, sharing questions to give back to the community. Phone screen: Subarray Sum Equals K (only positive numbers)",
      whoposted: "Manu_codeup",
    },
    {
      iconpath: profile_icon,
      time: "8 days ago",
      title: "Meta Onsite Interview Experience",
      text: "Just finished Meta onsite, sharing questions to give back to the community. Phone screen: Subarray Sum Equals K (only positive numbers)",
      whoposted: "Manu_codeup",
    },
    {
      iconpath: profile_icon,
      time: "8 days ago",
      title: "Meta Onsite Interview Experience",
      text: "Just finished Meta onsite, sharing questions to give back to the community. Phone screen: Subarray Sum Equals K (only positive numbers)",
      whoposted: "Manu_codeup",
    },
    {
      iconpath: profile_icon,
      time: "8 days ago",
      title: "Meta Onsite Interview Experience",
      text: "Just finished Meta onsite, sharing questions to give back to the community. Phone screen: Subarray Sum Equals K (only positive numbers)",
      whoposted: "Manu_codeup",
    },
  ];

  const { data: blogDatas, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => getAllBlogs(page, limit),
  });
  blogData = blogDatas;
  return (
    <div className={stylesall.container}>
      <ul>
        {isLoading ? (
          <Loader />
        ) : (
          blogData?.map((blog, index) => (
            <Blog blog={blog} index={index} key={index} />
          ))
        )}
      </ul>
    </div>
  );
};

export default Allblogs;
