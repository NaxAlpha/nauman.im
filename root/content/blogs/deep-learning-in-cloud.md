Deep Learning in Cloud — Cheap but High Quality
Nauman Mustafa
Nauman Mustafa

Follow
3 min read
·
Mar 18, 2019
111


1





Edit: Apparently, Google changed GPUs for Colab from K80 to Tesla T4. So now you can do high quality deep learning for free in Google Colab. But If you need more power, you can go V100 Preemptible machines, which cost far less compared to AWS.

Google Colab is a free platform that provides GPUs for training and is best for experimenting, but not ideal for training large models like Big GANs and Large Language models. And it's a hassle to always upload your model to Google Drive and then reload it when the machine is interrupted.

I have a decent GTX 1060 Laptop which I use to experiment with my model and set up training scripts. But once done, my laptop is good-for-nothing for such big models. So I started looking for alternate solutions. Then I found clouds :D


When it comes to cloud, many of us prefer AWS as it has been around for a while, it is trustworthy and it has a huge number of services. But its price is much higher than its competitors. (For training my model, I will be comparing GPU machine prices.)

p2.xlarge costs only 0.9$/hour, is again good-for-nothing as K80 GPUs perform poorly for deep learning. p3.2xlarge is 3$/hour for V100, which is in many cases worth it but still too costly. Going for spot instance it costs only 1.2$ per hour. Now that's how I like it.

My search continued as some of my models require less compute than V100 and 1.2$/hour is still expensive to most of us. This led me to Paperspace, an alternative to AWS but still provides low-end GPUs.

P4000 GPU on paperspace is close to performance to a desktop-grade GTX 1070 and costs only 0.51$ per hour. Going higher P5000 is close to GTX 1080 and costs 0.78$/hour. There is also P6000 which is ~GTX 1080 Ti with a price point of 1.1$/hour. V100 costs 2.3$. Good thing is these are not spot instances, so the price is justifiably lower than AWS.

I used paperspace for quite some time but their upfront cost (5$/mo for 50GB HDD) was kind of a drag for me. I only used like 5–10 hours of training on one machine a month. So my quest for cheap GPUs went on.


Google Cloud, a competitor of AWS, is growing cloud platform. Their mouth-watering price caught up on me. Their Preemptible (Spot instance) costs only 0.8$/hour for V100 and Preemptible Tesla T4 (which is comparable to RTX 2070 or 1080 + Mix precision) COSTS ONLY 0.35$/hour.

On Google Colab, you have to keep uploading model to Google Drive to save it otherwise its lost. But on these machine, even though they are preemptible when they shut down, their data is still intact. All you have to do is save your model every now and then :D


Cloud Computing
Machine Learning
Deep Learning
Hardware
Artificial Intelligence
111


1




Follow
Nauman Mustafa
Written by Nauman Mustafa
95 followers
·
85 following
Sr. Vibe Coder


Follow
Responses (1)

﻿

Cancel
Respond
Alper Yilmaz
Alper Yilmaz

Sep 18, 2019


vast.ai rents GPU as well. GTX 1080 Ti is around 0.10$/hr. GTX 2080 Ti is little over 0.20$/hr. They also have machines with 4X or 8X GPUs. For example, 4x RTX 2080 Ti is around 0.85$/hr.
5


Hide replies

Reply

Nauman Mustafa
Nauman Mustafa

Author
Sep 18, 2019


Hi Alper,
Thanks for sharing vast.ai. I had missed it previously but yes it is great platform and provides much better costing options than any cloud platform.
Reply