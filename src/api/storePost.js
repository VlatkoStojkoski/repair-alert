import { functions } from '.';

export default async function storePost(post) {
  try {
    const { data } = await functions.httpsCallable('newPost')(post);

    return data;
  } catch (error) {
    console.error(error?.response?.data || error);
  }
}
