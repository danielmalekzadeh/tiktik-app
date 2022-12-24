import { useState, useEffect } from "react";
import Image from "next/image";
import { GoVerified } from "react-icons/go";
import axios from "axios";

import VideoCard from "../../components/VideoCard";
import NoResults from "../../components/NoResults";

import { IUser, Video } from "../../type";
import { BASE_URL } from "../../utils";

interface IProps {
  data: {
    user: IUser;
    userVideos: Video[];
    userLikedVideos: Video[];
  };
}

const Profile = ({ data }: IProps) => {
  const { user, userVideos, userLikedVideos } = data;

  const [showUserVideo, setShowUserVideo] = useState(true);
  const [videoList, setVideoList] = useState<Video[]>([]);

  const videos = showUserVideo ? "border-b-2 border-black" : "text-gray-400";
  const liked = !showUserVideo ? "border-b-2 border-black" : "text-gray-400";

  useEffect(() => {
    if (showUserVideo) {
      setVideoList(userVideos);
    } else {
      setVideoList(userLikedVideos);
    }
  }, [showUserVideo, userLikedVideos, userVideos]);

  return (
    <div className="w-full">
      <div className="flex gap-6 md:gap-10 mb-4 bg-white w-full">
        <div className="w-16 h-16 md:w-32 md:h-32">
          <Image
            src={user.image}
            width={120}
            height={120}
            className="rounded-full"
            alt="user profile"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="md:text-2xl tracking-tighter flex gap-1 justify-center items-center text-md text-primary font-bold lowercase">
            {user.userName.replaceAll(" ", "")}
            <GoVerified className="text-blue-400" />
          </p>
          <p className="capitalize text-gray-400 text-xs md:text-xl justify-center">
            {user.userName}
          </p>
        </div>
      </div>
      <div>
        <div className="flex gap-10 mt-10 mb-10 border-b-2 border-gray-200 bg-white w-full relative">
          <p
            className={`text-xl font-semibold cursor-pointer mt-2 ${videos} absolute -top-9`}
            onClick={() => setShowUserVideo(true)}
          >
            Videos
          </p>
          <p
            className={`text-xl font-semibold cursor-pointer mt-2 ${liked} absolute -top-9 left-20`}
            onClick={() => setShowUserVideo(false)}
          >
            Liked
          </p>
        </div>
        <div className="flex gap-6 flex-wrap md:justify-start">
          {videoList.length > 0 ? (
            videoList.map((post: Video, idx: number) => (
              <VideoCard post={post} key={idx} />
            ))
          ) : (
            <NoResults text={`No ${showUserVideo ? "" : "liked"} yet.`} />
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const response = await axios.get(`${BASE_URL}/api/profile/${id}`);
  return {
    props: {
      data: response.data,
    },
  };
};

export default Profile;
