export async function withErrorHandling<T>(
  action: () => Promise<T>,
  errorMessage: string = "Something went wrong"
): Promise<T | { success: false; error: any }> {
  try {
    return await action();
  } catch (err) {
    console.error(`[Action Error]:`, err);
    return { success: false, error: errorMessage };
  }
}
