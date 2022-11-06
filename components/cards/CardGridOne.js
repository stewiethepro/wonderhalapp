import Link from "next/link";

  export default function CardGridOne({card}) {

      return (
        <>
              <div className="group aspect-w-2 aspect-h-1 shadow-2xl rounded-lg overflow-hidden sm:aspect-h-1 sm:aspect-w-3 sm:row-span-2 transition ease-in-out hover:-translate-y-1 hover:scale-100 duration-300">
                <img
                  src={card.imageSrc}
                  alt={card.imageAlt}
                  className="object-center object-cover"
                />
                <div aria-hidden="true" className={`bg-gradient-to-b from-transparent ${card.color} ${card.opacity}`}/>
                <div className="p-6 flex items-end ">
                  <div>
                    <h3 className="font-semibold text-white">
                      <Link href={card.href}>
                        <a>
                          <span className="absolute inset-0"/>
                          {card.name}
                        </a>
                      </Link>
                    </h3>
                    <p aria-hidden="true" className="mt-1 text-sm text-white">
                    {card.description}
                    </p>
                  </div>
                </div>
              </div>
          </>
      )
  }