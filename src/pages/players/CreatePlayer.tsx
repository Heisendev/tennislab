import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { z } from "zod";

import Header from "@components/Header";
import { COUNTRIES } from "@components/ui/Countryselector/countries";
import CountrySelector from "@components/ui/Countryselector/CountrySelector";
import type { SelectMenuOption } from "@components/ui/Countryselector/types";
import Input from "@components/ui/Input";
import { useCreatePlayer } from "@hooks/usePlayers";

const defaultValues = {
  firstname: "",
  lastname: "",
  picture: undefined as string | undefined,
  country: "FR" as SelectMenuOption["value"],
  hand: "Right" as const,
  birthday: undefined as string | undefined,
  height_cm: undefined as number | undefined,
  weight_kg: undefined as number | undefined,
  backhand: "Two-handed" as const,
  rank: "NC" as string,
};

const playerSchema = z.object({
  country: z.string().min(1, "players.errors.country"),
  firstname: z.string().trim().min(1, "players.errors.firstname"),
  lastname: z.string().trim().min(1, "players.errors.lastname"),
  picture: z.string().optional(),
  hand: z.enum(["Left", "Right"], {
    message: "players.errors.hand",
  }),
  backhand: z.enum(["One-handed", "Two-handed"], {
    message: "players.errors.backhand",
  }),
  rank: z.string().optional(),
  birthday: z.string().optional(),
  height_cm: z.number().positive().optional(),
  weight_kg: z.number().positive().optional(),
});

type Inputs = z.infer<typeof playerSchema>;

const renderError = (message: string) => (
  <p className="text-sm col-start-2 my-0 text-(--bg-interactive-danger) text-left pl-1">{message}</p>
);

const CreatePlayer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate } = useCreatePlayer();
  const [country, setCountry] = useState<SelectMenuOption["value"]>("FR");
  const [pictureName, setPictureName] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues,
    resolver: zodResolver(playerSchema),
  });

  const handlePictureChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      setPictureName("");
      setValue("picture", undefined, { shouldValidate: true });
      return;
    }

    setPictureName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : undefined;
      setValue("picture", result, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate(data, {
      onSuccess: async () => {
        navigate("/players");
      },
    });
  };

  useEffect(() => {
    register("country");
    register("picture");
  }, [register]);

  const handleChange = (value: SelectMenuOption["value"]) => {
    setCountry(value);
    setValue("country", value, { shouldValidate: true });
  };

  return (
    <>
      <Header title="Create a new player" />
      <section className="bg-white max-w-3xl mx-4 md:mx-auto p-6 m-8 border border-gray-400">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-x-4 mb-4">
            <Input
              id="firstname"
              label="First name"
              placeholder="Rafael"
              {...register("firstname")}
              variant={errors.firstname ? "error" : undefined}
            />
            {errors.firstname?.message && renderError(t(errors.firstname.message))}
          </div>
          <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-x-4 mb-4">
            <Input
              id="lastname"
              label="Last name"
              placeholder="Nadal"
              {...register("lastname")}
              variant={errors.lastname ? "error" : undefined}
            />
            {errors.lastname?.message && renderError(t(errors.lastname.message))}
          </div>
          <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-x-4 mb-4">
            <Input
              id="picture"
              label="Picture"
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              variant={errors.picture ? "error" : undefined}
            />
            {pictureName && (
              <p className="text-sm col-start-2 my-0 text-left pl-1 text-gray-500">{pictureName}</p>
            )}
            {errors.picture?.message && renderError(t(errors.picture.message))}
          </div>
          <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-x-4 mb-4">
            <Input
              id="birthday"
              label="Birthday"
              placeholder="YYYY-MM-DD"
              {...register("birthday")}
              variant={errors.birthday ? "error" : undefined}
            />
            {errors.birthday?.message && renderError(t(errors.birthday.message))}
          </div>
          <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-x-4 mb-4">
            <Input
              id="height_cm"
              label="Height (cm)"
              placeholder="185"
              {...register("height_cm", { valueAsNumber: true })}
              variant={errors.height_cm ? "error" : undefined}
            />
            {errors.height_cm?.message && renderError(t(errors.height_cm.message))}
          </div>
          <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-x-4 mb-4">
            <Input
              id="weight_kg"
              label="Weight (kg)"
              placeholder="75"
              {...register("weight_kg", { valueAsNumber: true })}
              variant={errors.weight_kg ? "error" : undefined}
            />
            {errors.weight_kg?.message && renderError(t(errors.weight_kg.message))}
          </div>
          <div
            role="radiogroup"
            aria-labelledby="handlabel"
            className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-x-4 mb-4"
          >
            <span id="handlabel" className="flex items-center gap-2">
              {t("players.hand")}
            </span>
            <div className="toggle">
              <input
                id="hand-left"
                type="radio"
                value="Left"
                {...register("hand")}
              />{" "}
              <label htmlFor="hand-left">{t("players.left")}</label>
              <input
                id="hand-right"
                type="radio"
                value="Right"
                {...register("hand")}
              />{" "}
              <label htmlFor="hand-right">{t("players.right")}</label>
            </div>
            {errors.hand?.message && renderError(t(errors.hand.message))}
          </div>
          <div
            role="radiogroup"
            aria-labelledby="backhandlabel mb-4"
            className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-x-4 mb-4"
          >
            <span id="backhandlabel" className="flex items-center gap-2">
              {t("players.backhand")}
            </span>
            <div className="toggle">
              <input
                id="backhand-one"
                type="radio"
                value="One-handed"
                {...register("backhand")}
              />{" "}
              <label htmlFor="backhand-one">{t("players.oneHanded")}</label>
              <input
                id="backhand-two"
                type="radio"
                value="Two-handed"
                {...register("backhand")}
              />{" "}
              <label htmlFor="backhand-two">{t("players.twoHanded")}</label>
            </div>
            {errors.backhand?.message && renderError(t(errors.backhand.message))}
          </div>

          <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-x-4 mb-4">
            <Input
              id="rank"
              label="Rank"
              placeholder="1"
              type="text"
              {...register("rank")}
              variant={errors.rank ? "error" : undefined}
            />
            {errors.rank?.message && renderError(t(errors.rank.message))}
          </div>
          <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-x-4 mb-4">
            {/* use a another select component for */}
            <span id="player_country" className="flex items-center gap-2">
              {t("players.country")}
            </span>
            <CountrySelector
              id="country"
              onChange={handleChange}
              selectedValue={
                COUNTRIES.find((option) => option.value === country) ||
                COUNTRIES[0]
              }
            />
            {errors.country?.message && renderError(t(errors.country.message))}
          </div>
          <Input
            id="createPlayer"
            label=""
            type="submit"
            variant="submit"
            value={t("players.createPlayer")}
          />
        </form>
      </section>
    </>
  );
};

export default CreatePlayer;
