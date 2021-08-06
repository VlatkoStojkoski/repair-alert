import { axios } from '../../api';

export default async function storePost(post) {
  try {
    const { data } = await axios.post('/api/post/new', post);

    console.log(data);
  } catch (error) {
    console.error(error?.response?.data || error);
  }
}
