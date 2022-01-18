type JokeProps = {
    words: string;
}

export default function({ words }: JokeProps) {
    return (
        <>
        <p>Joke Component</p>
        <p>{words}</p>
        </>
    );
}