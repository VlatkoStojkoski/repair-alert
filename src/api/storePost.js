import { functions } from '.';

export default async function storePost(post) {
  const { data } = await functions.httpsCallable('newPost')(post);

  return data;
}
